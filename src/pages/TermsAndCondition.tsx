import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const TermsAndCondition = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO
        title="Terms and Condition"
        description="Terms and Condition for Circuit Crafters project development services."
        keywords={[
          "terms and condition",
          "circuit crafters terms",
          "service agreement",
          "project payment policy",
        ]}
      />

      <Navigation />

      <main className="flex-grow pt-24 pb-14">
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 md:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Terms and Condition
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-8">
              Please read these terms carefully before requesting or purchasing
              any development service from Circuit Crafters.
            </p>

            <div className="space-y-8 text-foreground/95 leading-relaxed">
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  1. Scope of Services
                </h2>
                <p className="mb-3">
                  The Company provides development services including but not
                  limited to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Electronics project development</li>
                  <li>IoT system design and development</li>
                  <li>Hardware prototype development</li>
                  <li>Circuit design and PCB design</li>
                  <li>Embedded firmware or software development</li>
                  <li>Sensor and device integration</li>
                  <li>Testing and prototype demonstration</li>
                </ul>
                <p className="mt-3">
                  The exact scope, deliverables, and features of the project
                  will be clearly agreed upon before development begins.
                </p>
                <p className="mt-2">
                  Any request outside the agreed scope will be considered
                  additional work and may require additional charges.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  2. Payment Structure
                </h2>
                <p className="mb-3">
                  All projects follow a three-stage payment structure to ensure
                  fair commitment from both the Client and the Company.
                </p>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  2.1 Advance Payment - 40%
                </h3>
                <p>
                  A non-refundable advance payment of 40% of the total project
                  cost is required before development begins.
                </p>
                <p className="mt-2">
                  This payment confirms the project order and covers:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Research and technical planning</li>
                  <li>Component sourcing and procurement</li>
                  <li>Circuit design preparation</li>
                  <li>Initial development work</li>
                </ul>
                <p className="mt-2">
                  No development work will begin until this payment has been
                  received.
                </p>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  2.2 Prototype Completion Payment - 40%
                </h3>
                <p>
                  Once the working prototype or initial functional system has
                  been completed and demonstrated to the Client, the Client must
                  release the second payment of 40%.
                </p>
                <p className="mt-2">
                  Further development, optimization, or preparation for final
                  delivery will not continue until this payment is received.
                </p>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  2.3 Final Payment - 20%
                </h3>
                <p>
                  The remaining 20% payment must be completed before final
                  delivery of the project.
                </p>
                <p className="mt-2">Final deliverables such as:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Hardware prototype</li>
                  <li>Source code or firmware</li>
                  <li>Circuit diagrams</li>
                  <li>Documentation</li>
                </ul>
                <p className="mt-2">
                  will only be released after 100% payment is received.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  3. Miscellaneous Development Budget
                </h2>
                <p>
                  A 5% miscellaneous development budget is included in the total
                  project cost.
                </p>
                <p className="mt-2">
                  This amount covers minor unexpected development expenses such
                  as:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Additional small components</li>
                  <li>Testing materials</li>
                  <li>Minor design adjustments</li>
                  <li>Calibration and development overhead</li>
                </ul>
                <p className="mt-2">
                  This ensures smooth development without interruptions caused
                  by minor unforeseen costs.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  4. Prototype Definition
                </h2>
                <p>
                  A prototype refers to a working model demonstrating the core
                  functionality of the project.
                </p>
                <p className="mt-2">The prototype stage may include:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Hardware assembly</li>
                  <li>Firmware integration</li>
                  <li>Sensor or module integration</li>
                  <li>Functional testing and demonstration</li>
                </ul>
                <p className="mt-2">
                  The prototype is intended to validate the technical concept
                  and may not represent the final commercial product appearance.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  5. Revision and Modification Policy
                </h2>
                <p>
                  The project cost includes only the features and requirements
                  agreed upon before development begins.
                </p>
                <p className="mt-2">
                  The following will be treated as additional work:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Adding new features</li>
                  <li>Changing hardware architecture</li>
                  <li>PCB redesign</li>
                  <li>Major firmware or software changes</li>
                  <li>Additional sensors or modules</li>
                  <li>Functional redesign</li>
                </ul>
                <p className="mt-2">
                  Such requests may require additional development charges based
                  on complexity and development time.
                </p>
                <p className="mt-2">
                  Unlimited revisions are not included in the project cost.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  6. Intellectual Property Rights
                </h2>
                <p>
                  All circuits, designs, firmware, algorithms, and documentation
                  created during the project remain the intellectual property of
                  the Company until full payment is received.
                </p>
                <p className="mt-2">Before final payment:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    The Client may not copy, reproduce, distribute, or
                    commercially use any part of the design or prototype.
                  </li>
                  <li>
                    Reverse engineering or replication of the design is strictly
                    prohibited.
                  </li>
                </ul>
                <p className="mt-2">
                  After full payment is completed, the Client receives the right
                  to use the delivered project as agreed.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  7. Protection Against Design Misuse
                </h2>
                <p>
                  If a Client cancels a project after receiving prototype
                  demonstrations or technical explanations:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    The Client may not reproduce, copy, or independently build
                    the same design using knowledge shared during the project.
                  </li>
                  <li>
                    Any such action will be considered unauthorized use of
                    intellectual property.
                  </li>
                </ul>
                <p className="mt-2">
                  The Company reserves the right to take appropriate action in
                  such cases.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  8. Non-Payment Policy
                </h2>
                <p>
                  If the Client fails or refuses to complete required payments:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>The Company may immediately suspend development work.</li>
                  <li>
                    All deliverables including hardware, source code, firmware,
                    or documentation will be withheld.
                  </li>
                  <li>
                    The Client will not receive rights to use the developed
                    project.
                  </li>
                  <li>Advance payments remain non-refundable.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  9. Project Timeline
                </h2>
                <p>Project timelines depend on several factors including:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Component availability</li>
                  <li>Technical complexity</li>
                  <li>Testing requirements</li>
                  <li>Client feedback and approvals</li>
                </ul>
                <p className="mt-2">
                  Delays in payment, communication, or approvals may extend the
                  project timeline.
                </p>
                <p className="mt-2">
                  The Company will make reasonable efforts to complete the
                  project within the estimated timeframe.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  10. Client Responsibilities
                </h2>
                <p>The Client agrees to:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    Provide clear project requirements before development begins
                  </li>
                  <li>Respond to development queries in a timely manner</li>
                  <li>Review prototype demonstrations promptly</li>
                  <li>Complete payments according to the agreed schedule</li>
                </ul>
                <p className="mt-2">
                  Failure to provide required information or approvals may delay
                  project completion.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  11. Delivery Policy
                </h2>
                <p>
                  After successful completion and full payment, the Client may
                  receive:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Hardware prototype</li>
                  <li>Circuit diagrams (if included in scope)</li>
                  <li>Firmware or source code (if included)</li>
                  <li>Basic project documentation</li>
                </ul>
                <p className="mt-2">
                  Delivery format and content will depend on the agreed project
                  scope.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  12. Warranty and Liability
                </h2>
                <p>
                  Unless otherwise agreed, prototypes are developed primarily
                  for educational, research, and development purposes.
                </p>
                <p className="mt-2">
                  The Company shall not be responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Damage caused by improper usage</li>
                  <li>Unauthorized modifications made by the Client</li>
                  <li>Hardware failures caused by external factors</li>
                </ul>
                <p className="mt-2">
                  The Client is responsible for safe and appropriate use of the
                  delivered system.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  13. Support
                </h2>
                <p>
                  Basic clarification support may be provided for a limited
                  period after project delivery.
                </p>
                <p className="mt-2">
                  Additional support, maintenance, upgrades, or troubleshooting
                  may require separate service charges.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  14. Acceptance of Terms
                </h2>
                <p>
                  By requesting or purchasing services, the Client confirms that
                  they have read, understood, and agreed to these Terms and
                  Condition.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  15. Client Cancellation Policy
                </h2>
                <p>
                  Once development has started, the Client may cancel the
                  project only by providing written notice.
                </p>
                <p className="mt-2">If cancellation occurs:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>The 40% advance payment remains non-refundable.</li>
                  <li>
                    If cancellation occurs after development has started, the
                    Client must pay for the work completed up to that stage.
                  </li>
                  <li>
                    If cancellation occurs after prototype completion, the
                    Client may be required to pay up to 80% of the total project
                    cost.
                  </li>
                </ul>
                <p className="mt-2">
                  All designs, code, and documentation developed during the
                  project remain the property of the Company unless full payment
                  is completed.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  16. Late Payment Policy
                </h2>
                <p>
                  Payments must be completed according to the agreed schedule.
                </p>
                <p className="mt-2">If payment is delayed:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    The Company may pause or suspend development immediately.
                  </li>
                  <li>
                    Deliverables will not be released until outstanding payments
                    are cleared.
                  </li>
                  <li>
                    If payment is delayed for more than 15 days, a late payment
                    charge of up to 5% of the pending amount may be applied.
                  </li>
                  <li>
                    If payment is delayed for more than 30 days, the Company
                    reserves the right to terminate the agreement.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  17. Confidentiality and Non-Disclosure
                </h2>
                <p>
                  Both parties agree to maintain confidentiality regarding any
                  sensitive or proprietary information shared during the
                  project.
                </p>
                <p className="mt-2">This includes:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Technical designs</li>
                  <li>Circuit diagrams</li>
                  <li>Source code</li>
                  <li>Hardware architecture</li>
                  <li>Development documentation</li>
                </ul>
                <p className="mt-2">
                  The Client may not share or distribute such materials without
                  written permission.
                </p>
                <p className="mt-2">
                  This confidentiality obligation remains valid even after
                  project completion or cancellation.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  18. Project Use Disclaimer
                </h2>
                <p>
                  The delivered project or prototype is intended for research,
                  academic, or development purposes unless otherwise specified.
                </p>
                <p className="mt-2">
                  The Company does not guarantee suitability for commercial
                  production unless explicitly agreed in writing.
                </p>
                <p className="mt-2">The Company shall not be liable for:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Commercial losses</li>
                  <li>Production failures</li>
                  <li>
                    Safety issues arising from modifications or improper use
                  </li>
                </ul>
                <p className="mt-2">
                  The Client is responsible for ensuring compliance with
                  applicable safety standards and regulations if the project is
                  used commercially.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndCondition;
