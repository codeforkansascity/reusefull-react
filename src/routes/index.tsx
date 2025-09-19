import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, Headline, Text, Card, CardContent, CardHeader, CardTitle, Container } from '@/components/ui'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">RU</span>
              </div>
              <Headline as="h1" size="lg" className="text-primary">
                RE-USEFULL
              </Headline>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/donate">Donate</Link>
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40">
        <Container>
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <Headline as="h1" variant="reusefull" className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Give Stuff,
                <br />
                <span className="reusefull-gradient">Get Stuff</span>
              </Headline>
              <Text size="xl" variant="muted" align="center" className="max-w-3xl mx-auto text-lg sm:text-xl">
                Connect your donations with charities that need them most. Find the perfect match for your items and make a real difference
                in your community.
              </Text>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/donate">Start Donating</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/donate">Find Charities</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <Headline as="h3" size="2xl" variant="primary" className="font-bold">
                  500+
                </Headline>
                <Text variant="muted">Charity Partners</Text>
              </div>
              <div className="text-center space-y-2">
                <Headline as="h3" size="2xl" variant="reusefull" className="font-bold">
                  10K+
                </Headline>
                <Text variant="muted">Items Donated</Text>
              </div>
              <div className="text-center space-y-2">
                <Headline as="h3" size="2xl" variant="gradient" className="font-bold">
                  100%
                </Headline>
                <Text variant="muted">Free to Use</Text>
              </div>
            </div>
          </div>
        </Container>

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-primary/20 dark:to-secondary/20"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <Container>
          <div className="text-center space-y-16">
            <div className="space-y-4">
              <Headline as="h2" size="3xl" className="font-bold">
                How It Works
              </Headline>
              <Text size="lg" variant="muted" align="center" className="max-w-2xl mx-auto">
                Simple, fast, and effective. Get your donations to the right place in just a few clicks.
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card variant="elevated" padding="lg" className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <CardTitle>Tell Us What You Have</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text variant="muted">Select the types of items you want to donate and your preferences for pickup or drop-off.</Text>
                </CardContent>
              </Card>

              <Card variant="elevated" padding="lg" className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <CardTitle>Find Matching Charities</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text variant="muted">
                    We'll show you charities in your area that accept your specific items and match your preferences.
                  </Text>
                </CardContent>
              </Card>

              <Card variant="elevated" padding="lg" className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <CardTitle>Connect & Donate</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text variant="muted">
                    Contact the charity directly to arrange pickup or drop-off. Make a real difference in your community.
                  </Text>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <Container>
          <div className="text-center space-y-8">
            <Headline as="h2" size="3xl" className="font-bold">
              Ready to Make a Difference?
            </Headline>
            <Text size="lg" variant="muted" align="center" className="max-w-2xl mx-auto">
              Join thousands of people who are already making their communities better through smart donations.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/donate">Start Donating Now</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xs">RU</span>
              </div>
              <Text variant="muted">RE-USEFULL</Text>
            </div>
            <Text size="sm" variant="muted" align="center">
              Built with ❤️ to connect communities through meaningful donations
            </Text>
          </div>
        </Container>
      </footer>
    </div>
  )
}
