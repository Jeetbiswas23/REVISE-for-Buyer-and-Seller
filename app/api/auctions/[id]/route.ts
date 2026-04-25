import { getAuctionById, getAuctionState, getRFQById } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auctionId = params.id;
    const auction = getAuctionById(auctionId);

    if (!auction) {
      return Response.json({ error: 'Auction not found' }, { status: 404 });
    }

    const auctionState = getAuctionState(auctionId);
    const rfq = getRFQById(auction.rfqId);

    if (!auctionState || !rfq) {
      return Response.json({ error: 'Auction data incomplete' }, { status: 404 });
    }

    return Response.json({
      auction: auctionState,
      rfq,
    });
  } catch (error) {
    console.error('Error fetching auction:', error);
    return Response.json({ error: 'Failed to fetch auction' }, { status: 500 });
  }
}
