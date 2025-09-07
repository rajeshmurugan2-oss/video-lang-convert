'use client'

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string, price: number) => {
    setLoading(plan)
    try {
      // Here you would integrate with Stripe
      // For now, we'll show a success message
      toast.success(`Starting ${plan} subscription for $${price}/month`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Subscription activated! You can now use all premium features.')
    } catch {
      toast.error('Failed to process subscription. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Upgrade to unlock unlimited video conversions and premium features
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-green-800 font-semibold">
                  🛡️ 30-Day Money-Back Guarantee
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
                  <p className="text-gray-600 mb-6">Perfect for trying out our service</p>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>2 video conversions per month</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Basic language support (5 languages)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Standard quality audio</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Community support</span>
                    </li>
                  </ul>
                  <button 
                    disabled
                    className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                </div>
              </div>

              {/* Monthly Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-4">$5</div>
                  <p className="text-gray-600 mb-6">For regular content creators</p>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Unlimited video conversions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>All 20+ languages supported</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Multi-speaker detection</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>High quality audio output</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Gender-matched voices</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>ZIP download feature</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Priority email support</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => handleSubscribe('Monthly', 5)}
                    disabled={loading === 'monthly'}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading === 'monthly' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Upgrade to Monthly
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    $1 authorization charge to verify your card
                  </p>
                </div>
              </div>

              {/* Yearly Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Yearly</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-4">$50</div>
                  <div className="text-sm text-green-600 font-semibold mb-2">Save 17% ($10/year)</div>
                  <p className="text-gray-600 mb-6">Best value for professionals</p>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Unlimited video conversions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>All 20+ languages supported</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Multi-speaker detection</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Premium quality audio</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Gender-matched voices</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>ZIP download feature</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Priority email support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>API access (coming soon)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Bulk processing tools</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => handleSubscribe('Yearly', 50)}
                    disabled={loading === 'yearly'}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading === 'yearly' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Upgrade to Yearly
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    $1 authorization charge to verify your card
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the $1 authorization charge?
                  </h3>
                  <p className="text-gray-600">
                    We charge $1 to verify your payment method. This is a temporary authorization that will be refunded within 1-3 business days. It&apos;s not an additional fee.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-gray-600">
                    Yes! You can cancel your subscription anytime from your dashboard. You&apos;ll continue to have access to premium features until the end of your billing period.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What&apos;s your refund policy?
                  </h3>
                  <p className="text-gray-600">
                    We offer a 30-day money-back guarantee. If you&apos;re not satisfied with our service, contact us within 30 days for a full refund, no questions asked.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How does the free plan work?
                  </h3>
                  <p className="text-gray-600">
                    The free plan includes 2 video conversions per month with basic language support. Perfect for trying out our service before upgrading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  )
}
