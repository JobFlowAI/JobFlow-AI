import { ScrollReveal } from "@/components/ui/ScrollReveal";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-28">
        <ScrollReveal animationType="fade-up">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-12">Last Updated: March 27, 2026</p>

          <div className="space-y-12 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. What are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit a website. 
                They are widely used to make websites work more efficiently and to provide information 
                to the owners of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Cookies</h2>
              <p>
                JobFlow AI uses cookies to enhance your experience, remember your preferences, and 
                secure your account. Our usage falls into the following categories:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-4">
                <li>
                  <strong>Essential Cookies:</strong> These are necessary for the website to function 
                  correctly. They include session management, security features, and theme preferences 
                  (like remembering if you prefer Dark Mode).
                </li>
                <li>
                  <strong>Analytical Cookies:</strong> We use anonymized tracking to understand how 
                  users interact with our platform, which features are most popular, and where we 
                  can improve the user experience.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> These allow the website to remember choices 
                  you make (such as your username or region) and provide enhanced, more personal 
                  features.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Third-Party Cookies</h2>
              <p>
                Some cookies are placed by third-party services that appear on our pages. For example, 
                our payment provider (Stripe) may use cookies to process transactions securely and 
                detect potential fraud.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Managing Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings. You can choose 
                to block all cookies or only those from third parties. However, please note that 
                blocking essential cookies may significantly impact the functionality of JobFlow AI.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Changes to This Policy</h2>
              <p>
                We may update our Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We encourage you to review 
                this page periodically to stay informed about our use of cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Further Information</h2>
              <p>
                If you have any questions about our use of cookies, please contact us at 
                aifunk63@gmail.com.
              </p>
            </section>
          </div>
        </ScrollReveal>
      </main>

      <LandingFooter />
    </div>
  );
}
