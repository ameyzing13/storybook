import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, MessageSquare, Shield } from 'lucide-react';
import { LandingPageHeader } from '@/components/landing-page-header';

export default function LandingPage() {
  return (
    <div className="flex-1 w-full flex flex-col  items-center">
      <LandingPageHeader /> 
      {/* Hero Section */}
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-6">
            Your Personal AI Life Coach Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your life with personalized guidance, therapy, and self-reflection through the power of AI-driven journaling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our AI Life Coach?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Guidance</h3>
            <p className="text-muted-foreground">
              Get tailored advice and insights based on your unique journey and goals
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Structured Journaling</h3>
            <p className="text-muted-foreground">
              Follow guided prompts and exercises designed to promote self-discovery
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground">
              Receive intelligent feedback and therapeutic suggestions from our AI coach
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-blue-600 dark:bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Begin Your Transformation Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of others who have already started their journey to self-improvement
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
