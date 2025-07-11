import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Driving Knowledge Blog - VidApp",
  description: "Expert advice, tips, and insights to help you become a safer and more confident driver. Learn about road signs, driving techniques, safety tips, and more.",
  keywords: "driving blog, road safety, driving tips, Zimbabwe driving, driving advice, road signs, defensive driving",
  openGraph: {
    title: "Driving Knowledge Blog - VidApp",
    description: "Expert advice, tips, and insights to help you become a safer and more confident driver.",
    url: "https://permitly.wiki/blog",
    siteName: "VidApp",
    images: [{
      // Replace OpenGraph image reference
      url: "/screenshots/screenshot1.png",
      width: 1200,
      height: 630,
      alt: "VidApp Screenshot"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Driving Knowledge Blog - VidApp",
    description: "Expert advice, tips, and insights to help you become a safer and more confident driver.",
    // Replace Twitter card image reference
    images: ["/screenshots/screenshot1.png"]
  },
  alternates: {
    canonical: "https://permitly.wiki/blog"
  }
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white overflow-hidden">
      <div className="fixed inset-0 bg-[url('/image_p1_q1.png')] bg-cover bg-center opacity-10 z-0"></div>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}