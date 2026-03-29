import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "JobFlow AI",
  description: "Optimize your career with JobFlow AI. Create ATS-friendly resumes, automate your job search, and get personalized career outreach — all powered by advanced AI.",
  openGraph: {
    title: "JobFlow AI",
    description: "Optimize your career with JobFlow AI. Create ATS-friendly resumes, automate your job search, and get personalized career outreach — all powered by advanced AI.",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="author" content="Shahroz" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
