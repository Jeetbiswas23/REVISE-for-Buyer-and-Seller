import { createBid, createAuctionLog, getAuctionById, getBidsByAuctionId, getAuctionState } from '@/lib/db';
import { shouldExtendAuction, getNewCloseTime } from '@/lib/auction-logic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { supplierId, amount } = body;
    const auctionId = params.id;

    const auction = getAuctionById(auctionId);
    if (!auction) {
      return Response.json({ error: 'Auction not found' }, { status: 404 });
    }

    // Get previous bids
    const previousBids = getBidsByAuctionId(auctionId);

    // Check if bid is valid (lower than current lowest)
    if (previousBids.length > 0 && amount >= previousBids[0].amount) {
      return Response.json(
        { error: 'Bid must be lower than current lowest bid' },
        { status: 400 }
      );
    }

    // Create the bid
    const newBid = createBid({
      auctionId,
      supplierId,
      amount,
      rank: previousBids.length + 1,
      bidTime: new Date(),
    });

    // Log the bid
    createAuctionLog(auctionId, 'bid_placed', {
      supplierId,
      amount,
      bidCount: previousBids.length + 1,
      lowestBid: previousBids.length > 0 ? previousBids[0].amount : amount,
    });

    // Check if extension should be triggered
    const currentTime = new Date();
    if (shouldExtendAuction(auction, previousBids, newBid, currentTime)) {
      const newCloseTime = getNewCloseTime(auction, auction.bidCloseTime, currentTime);
      auction.bidCloseTime = newCloseTime;

      createAuctionLog(auctionId, 'extension_triggered', {
        newCloseTime,
        extensionDurationMinutes: auction.extensionDurationMinutes,
        reason: 'Bid placed within trigger window',
      });
    }

    return Response.json({
      success: true,
      bid: newBid,
      auction,
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    return Response.json({ error: 'Failed to place bid' }, { status: 500 });
  }
}
