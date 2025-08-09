'use client'

import React, { useState } from 'react'

export default function FAQ() {
const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id) => {
    setOpenFAQ((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 bg-primary-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-center  font-bold text-4xl md:text-5xl mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-primary-muted text-center mb-12">
              Everything you need to know about player submissions
            </p>
            <div className="space-y-6">
              {[
                {
                  id: 1,
                  question: "How long does it take to get reviewed?",
                  answer:
                    "Basic submissions are reviewed within 7 days, Standard within 24 hours, and Pro submissions are approved instantly.",
                },
                {
                  id: 2,
                  question: "What happens after I submit?",
                  answer:
                    "Your profile will be reviewed and published on our platform where scouts and clubs can discover you. You'll receive email updates on views and interest.",
                },
                {
                  id: 3,
                  question: "Can I upgrade my plan later?",
                  answer:
                    "Yes, you can upgrade your submission at any time. The price difference will be calculated and additional features will be activated immediately.",
                },
              ].map(({ id, question, answer }) => (
                <div
                  key={id}
                  className="bg-primary-bg rounded-xl border border-divider p-6"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFAQ(id)}
                  >
                    <h3 className=" font-semibold text-lg">
                      {question}
                    </h3>
                    <i
                      className={`fa-solid fa-chevron-${
                        openFAQ === id ? "up" : "down"
                      } text-accent-red`}
                    />
                  </div>
                  {openFAQ === id && (
                    <div className="mt-4 text-primary-muted transition-opacity duration-200">
                      {answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
  )
}
