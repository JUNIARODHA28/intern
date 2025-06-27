// frontend/src/pages/TermsPage.js
// Placeholder for the Terms and Conditions page.

import React from 'react';

const TermsPage = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)', // Adjust based on navbar/footer height
    padding: '1rem'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxWidth: '800px',
    width: '100%'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: '1.5rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: '1.5rem',
    marginBottom: '0.75rem'
  };

  const paragraphStyle = {
    fontSize: '1rem',
    color: '#4b5563',
    lineHeight: '1.6',
    marginBottom: '1rem'
  };

  const listStyle = {
    listStyleType: 'disc',
    marginLeft: '1.5rem',
    marginBottom: '1rem',
    color: '#4b5563'
  };

  const listItemStyle = {
    marginBottom: '0.5rem'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Terms and Conditions</h1>
        
        <p style={paragraphStyle}>
          Welcome to Helping Service! These terms and conditions outline the rules and regulations for the use of Helping Service's Website.
        </p>

        <h2 style={sectionTitleStyle}>1. Acceptance of Terms</h2>
        <p style={paragraphStyle}>
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use Helping Service if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 style={sectionTitleStyle}>2. User Roles</h2>
        <p style={paragraphStyle}>
          Our platform facilitates connections between:
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            <strong>Help Seekers:</strong> Individuals or entities requesting assistance.
          </li>
          <li style={listItemStyle}>
            <strong>Volunteers:</strong> Individuals offering their time and skills to provide assistance.
          </li>
          <li style={listItemStyle}>
            <strong>Admins:</strong> Users responsible for overseeing and managing the platform.
          </li>
        </ul>

        <h2 style={sectionTitleStyle}>3. Content Liability</h2>
        <p style={paragraphStyle}>
          We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
        </p>

        <h2 style={sectionTitleStyle}>4. Your Privacy</h2>
        <p style={paragraphStyle}>
          Please read our Privacy Policy.
        </p>

        <h2 style={sectionTitleStyle}>5. Reservation of Rights</h2>
        <p style={paragraphStyle}>
          We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
        </p>

        <h2 style={sectionTitleStyle}>6. Disclaimer</h2>
        <p style={paragraphStyle}>
          To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            limit or exclude our or your liability for death or personal injury;
          </li>
          <li style={listItemStyle}>
            limit or exclude our or your liability for fraud or fraudulent misrepresentation;
          </li>
          <li style={listItemStyle}>
            limit any of our or your liabilities in any way that is not permitted under applicable law; or
          </li>
          <li style={listItemStyle}>
            exclude any of our or your liabilities that may not be excluded under applicable law.
          </li>
        </ul>
        <p style={paragraphStyle}>
          The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
        </p>
        <p style={paragraphStyle}>
          As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
