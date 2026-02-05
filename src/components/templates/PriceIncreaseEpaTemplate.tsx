export const PriceIncreaseEpaTemplate = ({ data }: { data: any }) => (
  <div className="relative text-[13px] leading-[1.6] text-foreground px-8 py-6">
    <div className="absolute top-6 right-8">
      <img
        src="winvale-logo.png"
        alt="Winvale"
        className="h-10 w-[140px] object-contain"
      />
    </div>

    <p className="mb-4"><strong>[{data.submissionDate}]</strong></p>


    <div className="mb-4">
      Attn: <strong>{data.contractorName}</strong> (<strong>{data.contractNumber}</strong>) <p>General Services Administration</p>
      <p><strong>{data.gsaOfficeAddressLine}</strong></p>
      <p><strong>{data.gsaOfficeCityStateZip}</strong></p>
    </div>

    <div className="mb-4">
      <p>
        <strong>Re:</strong> <strong>{data.companyName}</strong>
        <br />
        <strong>
          EPA Modification Based on a Commercial Price List to GSA Contract{" "}
          <strong>{data.contractNumber}</strong>
        </strong>
      </p>
    </div>

    <p className="mb-3">
      Dear <strong>{data.salutation}</strong> <strong>{data.contractorName}</strong>
    </p>


    <p className="mb-4">
      The purpose of this letter is to request your approval of an Economic Price
      Adjustment (EPA) increase based on a Commercial Price List to GSA Schedule
      Contract <strong>{data.contractNumber}</strong> under SIN <strong>{data.sin}</strong>. This request is
      submitted in accordance with EPA Clause GSAM 538.270-4(a)(3). The proposed
      modification consists of a price increase of{" "}
      <strong>{data.requestedIncrease || data.priceIncreasePercent}</strong> for{" "}
      <strong>{data.numberOfItemsAffected}</strong> item(s).
    </p>

    <p className="mb-4">
      The requested price adjustment is necessary due to documented increases in
      the contractor’s commercial pricing, resulting from higher labor costs,
      increased supplier and manufacturing expenses, rising transportation and
      logistics costs, and general market inflation. These increases are
      consistent with pricing adjustments applied across the contractor’s
      commercial customer base and are supported by the submitted commercial
      price list and accompanying documentation. The proposed increase strictly
      adheres to the established EPA methodology and does not exceed the
      allowable ceiling defined under the contract.
    </p>

    <ul className="list-disc ml-6 mb-4 space-y-2">
      <li>
        <strong>{data.backgroundInfo ||
          "Current commercial pricing reflects increased labor, operational, and supply chain costs. Supporting documentation, including updated commercial price lists and applicable escalation data, is included with this modification."}</strong>
      </li>
      <li>
        <strong>{data.justification ||
          "The requested EPA is calculated in accordance with the contractually approved EPA clause and methodology. The increase does not exceed the contract ceiling, and all required supporting documentation has been provided within eMod."}</strong>
      </li>
      <li>
        <strong>{data.companyName}</strong> acknowledges that the proposed price increase will not
        become effective until the Contracting Officer executes the completed
        modification.
      </li>
      <li>All prices offered to GSA include the current Industrial Funding Fee (IFF).</li>
      <li>
        <strong>{data.cspStatement ||
          "For non-TDR contracts only: Commercial Sales Practices (CSP) information previously submitted remains accurate and unchanged. If CSP information has changed, an updated CSP-1 has been provided with this modification."}</strong>
      </li>
      <li>
        Statement confirming:{" "}
        <span className="italic">
          “This request conforms to the agreed-upon EPA method and mechanism.”
        </span>
      </li>
    </ul>

    <p className="mb-4">
      I certify, to the best of my knowledge and belief, that the information
      submitted in support of this request is current, complete, and accurate.
      All other terms and conditions of the contract remain unchanged.
    </p>

    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      <strong>{data.consultantName}</strong> at <strong>{data.consultantPhone}</strong> or{" "}
      <strong>{data.consultantEmail}</strong>.
    </p>

    <p className="mb-6">Respectfully,</p>

    <div>
      <p className="font-semibold">
        <strong>{data.authorizedNegotiatorName || "John R. Doe"}</strong>
      </p>
      <p>
        <strong>{data.authorizedNegotiatorTitle || "Director of Contracts"}</strong> – Authorized
        to sign on behalf of <strong>{data.companyName || "COMPANY NAME"}</strong>
      </p>
    </div>
  </div>
);
