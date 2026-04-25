'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRFQ, createAuction } from '@/lib/db';
import { User } from '@/lib/types';
import Header from '@/components/header';

export default function CreateRFQPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    origin: '',
    destination: '',
    pickupDate: '',
    bidStart: '',
    bidClose: '',
    forcedClose: '',
    triggerWindow: '2',
    extensionDuration: '2',
  });

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/signup');
      return;
    }

    const currentUser = JSON.parse(userStr);
    if (currentUser.role !== 'buyer') {
      router.push('/dashboard');
      return;
    }

    setUser(currentUser);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create RFQ
      const rfq = createRFQ({
        title: formData.title,
        description: formData.description,
        origin: formData.origin,
        destination: formData.destination,
        pickupDate: new Date(formData.pickupDate),
        buyerId: user!.id,
      });

      // Create auction
      createAuction({
        rfqId: rfq.id,
        bidStartTime: new Date(formData.bidStart),
        bidCloseTime: new Date(formData.bidClose),
        forcedCloseTime: new Date(formData.forcedClose),
        triggerWindowMinutes: parseInt(formData.triggerWindow),
        extensionDurationMinutes: parseInt(formData.extensionDuration),
        status: 'scheduled',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create RFQ:', error);
      alert('Failed to create RFQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={null} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs tracking-wider text-muted-foreground mb-2">PROCUREMENT</p>
          <h1 className="text-4xl font-bold text-foreground mb-2">Create RFQ</h1>
          <p className="text-foreground/70">
            Define the auction window, forced close, and extension behavior.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Request Details */}
          <div className="border border-border rounded-lg bg-card p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">REQUEST DETAILS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    RFQ TITLE *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="e.g., TEST_Cap_bea854"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    PICKUP / SERVICE DATE *
                  </label>
                  <input
                    type="datetime-local"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    ORIGIN
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="Mumbai, IN"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    DESTINATION
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="Singapore, SG"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                  DESCRIPTION
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-24"
                  placeholder="Describe the shipment, special requirements, etc..."
                />
              </div>
            </div>
          </div>

          {/* Auction Window */}
          <div className="border border-border rounded-lg bg-card p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">AUCTION WINDOW</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    BID START *
                  </label>
                  <input
                    type="datetime-local"
                    name="bidStart"
                    value={formData.bidStart}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    BID CLOSE *
                  </label>
                  <input
                    type="datetime-local"
                    name="bidClose"
                    value={formData.bidClose}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    FORCED CLOSE * (HARD CAP)
                  </label>
                  <input
                    type="datetime-local"
                    name="forcedClose"
                    value={formData.forcedClose}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* British Auction Extension */}
          <div className="border border-border rounded-lg bg-card p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">
                BRITISH AUCTION EXTENSION
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    TRIGGER WINDOW (X) - MINUTES BEFORE CLOSE
                  </label>
                  <input
                    type="number"
                    name="triggerWindow"
                    value={formData.triggerWindow}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-wider text-muted-foreground block mb-3">
                    EXTENSION DURATION (Y) - MINUTES
                  </label>
                  <input
                    type="number"
                    name="extensionDuration"
                    value={formData.extensionDuration}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-secondary/50 border border-border rounded p-4">
                ⓘ Auction extends by Y minutes when: bid placed within last X min • L1 (lowest bidder)
                changes • any rank change. Never exceeds Forced Close.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-border rounded font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Create RFQ →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
