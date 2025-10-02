'use client';

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FaSpinner } from "react-icons/fa";
import "aos/dist/aos.css";
import { handleContactSubmit } from "@/actions/emailActions";
import Link from "next/link";

// Define EmailError if not imported from elsewhere
class EmailError extends Error {
  constructor(error) {
    super(error);
    this.name = "EmailError";
    this.error = error;
  }
}

export default function ContactClient({ lang = 'en', dict }) {
  const { toast } = useToast();
  const [status, setStatus] = useState("idle");

  /**
   * Handles the contact form submission, sends form data via emailActions,
   * displays toast notifications based on the result, and resets the form.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    try {
      const result = await handleContactSubmit(formData);
      
      if (result.success) {
        toast({
          title: dict?.contact?.success || "Message Sent",
          description: dict?.contact?.success || "We have received your message and will respond shortly.",
        });
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
        if (result.error instanceof Error) {
          throw result.error;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
        });
      } else if (error instanceof EmailError) {
        toast({
          title: error.name,
          description: error.error,
        });
      }
    } finally {
      setStatus("idle");
    }
  };

  return (
    <main className="bg-primary-bg text-primary-text font-inter">
      <section className="py-16 text-center">
        <h1 className="text-primary-text  font-bold text-[clamp(1.2rem,2.5vw,2.5rem)] md:text-5xl mb-4">
          {dict?.contact?.title || "Contact Us"}
        </h1>
        <p className="text-primary-muted text-lg max-w-2xl mx-auto mb-4">
          {dict?.contact?.subtitle || "Get in touch with our team"}
        </p>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row gap-12">
         
            <div className="flex flex-col gap-4 bg-primary-card rounded-xl p-8 border border-divider shadow-lg" data-aos="fade-down" >
              {[
                {
                  title: "Company Name",
                  icon: "fa-building",
                  color: "red",
                  text: "Soccer Bank Sports Management",
                  subtitle: "Official Name",
                },
                {
                  title: "Email",
                  icon: "fa-envelope",
                  color: "red",
                  text: "contact@footballbank.soccer",
                  subtitle: "Our inbox is always open",
                },
                {
                  title: "P.O Box",
                  icon: "fa-envelope",
                  color: "red",
                  text: "PO BOX 7268, Newark, NJ, Zip: 07107",
                  subtitle: "Mailing Address",
                },
                {
                  title: "Global Branches",
                  icon: "fa-globe",
                  color: "red",
                  text: "Africa, US, UK, Europe",
                  subtitle: "We operate worldwide",
                },
                {
                  title: "Licensing",
                  icon: "fa-id-card",
                  color: "red",
                  text: "FIFA Licensed Agent, Certified Scout",
                  subtitle: "Accredited & Verified",
                },
              ].map(({ title, icon, color, text, subtitle }) => (
                <div key={title} className="flex gap-4 items-start rounded-xl p-8 border border-divider shadow-lg" data-aos="fade-left" data-aos-delay="300">
                  <div
                    className={`w-16 h-16 bg-accent-${color}/10 rounded-full flex items-center justify-center `}
                  >
                    <i
                      className={`fa-solid ${icon} text-accent-${color} text-2xl`}
                    />
                  </div>
                  <div>
                    <h3 className=" font-semibold text-xl mb-2">
                      {title}
                    </h3>
                    <p className="text-primary-muted mb-1">{subtitle}</p>
                    <p className={`text-accent-${color} font-medium text-sm`}>
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
         
          <div className="bg-primary-card rounded-xl border border-divider shadow-lg px-4 py-8 md:px-8 md:py-12 w-full md:w-2/3" data-aos="flip-left">
            <h2 className=" font-bold text-2xl md:text-3xl mb-8">
              {dict?.contact?.send || "Send Us a Message"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {dict?.contact?.name || "Full Name"}
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-primary-card border border-divider rounded-lg px-4 py-3"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {dict?.contact?.email || "Email Address"}
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-primary-card border border-divider rounded-lg px-4 py-3"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {dict?.contact?.subject || "Subject"}
                </label>
                <select
                  name="subject"
                  className="w-full bg-primary-card border border-divider rounded-lg px-4 py-3"
                >
                  <option value="">Select a subject</option>
                  <option value="Player Representation">
                    Player Representation
                  </option>
                  <option value="Trial Request">Trial Request</option>
                  <option value="Career Consultation">
                    Career Consultation
                  </option>
                  <option value="Business Inquiry">Business Inquiry</option>
                  <option value="Fitness Branding">Fitness Branding</option>
                  <option value="Transfer Inquiry">Transfer Inquiry</option>
                  <option value="Partnership Opportunity">
                    Partnership Opportunity
                  </option>
                  <option value="General Question">General Question</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {dict?.contact?.message || "Message"}
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="w-full bg-primary-card border border-divider rounded-lg px-4 py-3 resize-none"
                  placeholder="Tell us about your goals, experience, and how we can help you..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-accent-red hover:bg-accent-red/90 text-white px-8 py-4 rounded-lg font-semibold"
              >
                {status === "loading" ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    {dict?.contact?.sending || "Sending..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <i className="fa-solid fa-paper-plane mr-2" />
                    {dict?.contact?.send || "Send Message"}
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className=" font-bold text-3xl mb-8">
            Follow Our Journey
          </h2>
          <p className="text-primary-muted text-lg mb-12">
            Connect with us on social media to stay up to date with global
            football talent and opportunities.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Instagram",
                icon: "instagram",
                color: "red",
                href: "https://www.instagram.com/footballbank.soccer",
                handle: "@FootballBank.soccer",
              },
              {
                name: "YouTube",
                icon: "youtube",
                color: "red",
                href: 'http://www.youtube.com/@footballbank.soccer',
                handle: "FootballBank.soccer",
              },
              {
                name: "Facebook",
                icon: "facebook",
                color: "blue",
                href: "https://www.facebook.com/profile.php?id=61580081775450",
                handle: "FootballBank Global",
              },
              {
                name: "Twitter",
                icon: "twitter",
                color: "blue",
                href: "https://x.com/footballbankhq?s=21&t=Ihzjw_SrtnHA4qE0nkgFfg",
                handle: "@footballbankhq",
              },
              {
                name: "TikTok",
                icon: "tiktok",
                color: "red",
                href: "http://www.tiktok.com/@footballbank.soccer",
                handle: "@footballbank.soccer",
              },
            ].map(({ name, icon, color, handle, href }) => (
              <Link
                href={href}
                target="_blank"
                key={name}
                className={`bg-primary-card rounded-xl p-6 border border-divider shadow-lg hover:border-accent-${color} transition-colors cursor-pointer`}
              >
                <i
                  className={`fa-brands fa-${icon} text-accent-${color} text-3xl mb-4`}
                />
                <p className="font-medium">{name}</p>
                <p className="text-primary-muted text-sm">{handle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
