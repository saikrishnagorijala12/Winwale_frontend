export const PriceIncreaseEpaTemplate = ({ data }: { data: any }) => (
  <div
    className="relative text-[14px] leading-[1.6] text-foreground px-12 py-10"
    style={{ fontFamily: "'Times New Roman', Times, serif" }}
  >
    <div className="absolute top-6 right-8">
      <img src="logo.png" alt="Winvale" className="h-10 w-35 object-contain" />
    </div>

    <p className="mb-6">{data.submissionDate}</p>

    <p className="mb-6">
      Attn: {data.contractorName} ({data.contractNumber}) <br />
      General Services Administration <br />
      {data.gsaOfficeAddressLine} <br />
      {data.gsaOfficeCityStateZip}
    </p>

    <div className="mb-6">
      <p>
        <strong>Re:</strong> <strong>{data.companyName}</strong>
        <br />
        <strong>
          EPA Modification Based on a Commercial Price List to GSA Contract{" "}
          <strong>{data.contractNumber}</strong>
        </strong>
      </p>
    </div>

    <p className="mb-4">
      Dear {data.salutation} {data.contractorName}
    </p>

    <p className="mb-4">
      The purpose of this letter is to request your approval of an Economic
      Price Adjustment (EPA) increase based on a Commercial Price List to GSA
      Schedule Contract <strong>{data.contractNumber}</strong> under SIN{" "}
      <strong>{data.sin_price_increase}</strong>. This request is in accordance
      with EPA Clause GSAM 538.270-4(a)(3). The modification consists of a price
      increase of{" "}
      <strong>{data.requestedIncrease || data.priceIncreasePercent}%</strong>{" "}
      for <strong>{data.priceIncreased}</strong> item(s) due to{" "}
      <strong>{data.increaseRationale}</strong>.
    </p>

    <ul className="list-[lower-alpha] ml-10 mb-4 space-y-2">
      <li>
        {data.backgroundInfo ||
          "[Background information regarding your current prices, the applicable wage determination price levels (if applicable), and the increases necessary for your company.]"}
      </li>
      <li>
        {data.justification ||
          "[Justification for increase. If the EPA requested exceeds the allowable Ceiling Limit, provide specific justification and attach supporting documentation to the modification.] "}
      </li>
      <li>
        {data.companyName} acknowledges that the proposed price increase will
        not become effective until the Contracting Officer executes the
        completed modification.
      </li>
      <li>
        All prices offered to GSA include the current Industrial Funding Fee
        (IFF).
      </li>
      <li>
        {data.cspStatement ||
          "For non-TDR only: Statement that Commercial Sales Practices (CSP) Information in accordance with GSAR 552.238-81 PRICE REDUCTIONS (see most current Solicitation for clause/deviation effective date) previously submitted with the initial award (or contract modification) or CSP-1 has not changed, if applicable. If CSP has changed, provide updated CSP-1 in eMod."}
      </li>
      <li>
        {data.confirmStatement ||
          "This request conforms to the agreed upon EPA method."}
      </li>
    </ul>

    <p className="mb-4">
      I certify to the best of my knowledge that the information I provided is
      current, complete and accurate. All other terms and conditions remain the
      same.
    </p>

    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      <strong>{data.consultantName}</strong> at The Winvale Group at{" "}
      <strong>{data.consultantPhone}</strong> or{" "}
      <strong>{data.consultantEmail}</strong>.
    </p>

    <p className="mb-4">Respectfully,</p>
    <div>
      <p>
        _________________________________
        <br />
        {data.negotiatorName || "AUTHORIZED NEGOTIATOR NAME"}
        <br />
        {data.negotiatorTitle || "[Title]"} – Authorized to sign on behalf of{" "}
        {data.companyName || "COMPANY NAME"}
      </p>
    </div>
  </div>
);
