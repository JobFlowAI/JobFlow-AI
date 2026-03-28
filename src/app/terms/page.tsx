"use client";

import { motion } from "framer-motion";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last Updated: March 27, 2026</p>

          <div className="space-y-12 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using JobFlow AI ("the Service"), you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, you are 
                prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
              <p>
                We grant you a personal, non-exclusive, non-transferable license to use the Service for your 
                personal career development. This license does not include:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Reselling or commercially exploiting the Service.</li>
                <li>Using automated systems or software to extract data from the website.</li>
                <li>Attempting to reverse engineer or decompile any software contained in the Service.</li>
                <li>Creating multiple accounts to circumvent credit limits or promotional restrictions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. AI Service Limitations</h2>
              <p>
                JobFlow AI provides AI-generated content and suggestions for resume optimization. While we 
                strive for high accuracy and effectiveness:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>The Service is provided "as is" and "as available" without any warranty.</li>
                <li>We do not guarantee that using the Service will result in a job offer or an interview.</li>
                <li>Success depends on numerous factors outside the control of the Service, including market 
                    conditions and individual candidate qualifications.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Credit System and Payments</h2>
              <p>
                Certain features of JobFlow AI require "Credits." These credits are consumed based on the 
                complexity of the AI tasks performed.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Credits purchased are non-refundable unless required by law.</li>
                <li>We reserve the right to change the credit cost of features at any time.</li>
                <li>Monthly subscription credits refresh at the start of each billing cycle and do not roll over.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. User Content</h2>
              <p>
                You retain all rights to the resumes and personal data you upload to JobFlow AI. By uploading 
                content, you grant us a worldwide, non-exclusive license to use, reproduce, and process 
                that content solely for the purpose of providing and improving the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
              <p>
                In no event shall JobFlow AI or its founder be liable for any damages (including, without 
                limitation, damages for loss of data or profit) arising out of the use or inability to 
                use the Service, even if notified of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws 
                applicable in your jurisdiction, and you irrevocably submit to the exclusive jurisdiction 
                of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Us</h2>
              <p>
                For any questions regarding these Terms of Service, please contact us at aifunk63@gmail.com.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
}
