import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-primary-card px-16 pt-16 pb-8 border-t border-divider">
        <div className="max-w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <span className="font-poppins font-bold text-2xl text-accent-red mb-4 inline-block cursor-pointer">
                FootballBank<span className="text-accent-red">.soccer</span>
              </span>
              <p className="text-primary-muted mb-6">Empowering football talent worldwide through visibility and opportunity.</p>
              <div className="flex space-x-4">
                {['twitter', 'instagram', 'facebook', 'youtube'].map((brand) => (
                  <span key={brand} className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer">
                    <i className={`fa-brands fa-${brand} text-xl`} />
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4 text-primary-text">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Players', 'Live Scores', 'Submit Profile', 'About Us'].map((link) => (
                  <li key={link} className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer">{link}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4 text-primary-text">Resources</h3>
              <ul className="space-y-2">
                {['Blog', 'Career Tips', 'Success Stories', 'Training Resources', 'FAQ'].map((link) => (
                  <li key={link} className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer">{link}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4 text-primary-text">Contact</h3>
              <ul className="space-y-2">
                {[
                  'info@footballbank.soccer',
                  '+44 20 7946 0958',
                  'London, UK',
                  'Privacy Policy',
                  'Terms of Service',
                ].map((item) => (
                  <li key={item} className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-muted text-sm">© {new Date().getFullYear()} FootballBank.soccer. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <span key={item} className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
  )
}
