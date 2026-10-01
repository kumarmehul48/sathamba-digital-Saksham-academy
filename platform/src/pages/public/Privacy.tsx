export default function Privacy() { return legalPage('Privacy Policy', 'Last updated: (launch date)')}
function legalPage(title: string, updated: string) {
  return (
    <div><div className="bg-primary text-white py-12 text-center"><h1 className="text-3xl font-extrabold">{title}</h1></div>
    <div className="container-sdsa section-pad max-w-3xl text-gray-700 text-sm space-y-4">
      <p className="text-gray-400">{updated}</p>
      <p><b>1. What we collect.</b> When you apply, enquire or enroll, we collect only what we need: name, mobile, email, village, course interest, and (for enrolled students) attendance, submissions, assessment results and portfolio work.</p>
      <p><b>2. Why we use it.</b> To process your admission, run your course, track progress, issue certificates and communicate with you. We never sell or rent your data or use it for marketing without consent.</p>
      <p><b>3. Students under 18.</b> We require a parent/guardian's consent before collecting a minor student's details.</p>
      <p><b>4. Data safety.</b> Student data is stored with access controls; only authorized staff and the student can see it. Payment details are processed by our payment provider and never stored on this website.</p>
      <p><b>5. Your rights.</b> You can ask us to show, correct or delete your data anytime: WhatsApp +91 70437 95279 or kumarmehul48@gmail.com. We respond within 7 working days.</p>
      <p><b>6. Grievance Officer.</b> Mehul Parmar, +91 70437 95279, kumarmehul48@gmail.com.</p>
      <p><b>7. Legal.</b> This policy follows the Digital Personal Data Protection Act, 2023 (India).</p>
    </div></div>
  );
}
