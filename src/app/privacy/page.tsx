import { ScrollReveal } from "@/components/ui/ScrollReveal";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-28">
        <ScrollReveal animationType="fade-up">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last Updated: March 27, 2026</p>

          <div className="space-y-12 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p>
                Welcome to JobFlow AI. We value your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
                AI-powered resume building and career optimization services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Data We Collect</h2>
              <p>To provide our services, we may collect the following types of information:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Personal Identifiers:</strong> Name, email address, and professional contact details.</li>
                <li><strong>Resume Data:</strong> Employment history, education, skills, and any other information you upload or input into our platform.</li>
                <li><strong>Usage Information:</strong> Data on how you interact with our tools, including credit usage and feature preferences.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device information for security and optimization purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use AI with Your Data</h2>
              <p>
                JobFlow AI utilizes advanced machine learning models to analyze and optimize your resume content. 
                Our AI processing is designed with your privacy in mind:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Your resume data is processed to provide real-time suggestions and ATS optimization.</li>
                <li>We do not sell your personal data or resume content to third-party advertisers.</li>
                <li>AI models are trained on anonymized, aggregated data to improve accuracy and performance for all users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Storage and Security</h2>
              <p>
                We implement industry-standard security measures to protect your data from unauthorized access, 
                disclosure, or alteration. Your information is stored on secure cloud servers with restricted 
                access. While we strive to use commercially acceptable means to protect your data, no method 
                of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Third-Party Services</h2>
              <p>
                We may use trusted third-party service providers to facilitate our services (e.g., payment 
                processing, cloud hosting). These third parties have access to your data only to perform 
                specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
              <p>
                Depending on your location, you may have rights regarding your personal data, including the 
                right to access, correct, or delete the information we hold about you. You can manage 
                your data directly through your account settings or contact us for assistance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please reach out 
                to us at aifunk63@gmail.com.
              </p>
            </section>
          </div>
        </ScrollReveal>
      </main>

      <LandingFooter />
    </div>
  );
}
