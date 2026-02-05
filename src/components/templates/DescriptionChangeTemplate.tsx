export const ProductDescriptiveChangeTemplate = ({ data }: { data: any }) => (
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
          Product Descriptive Change Modification to GSA Contract{" "}
          <strong>{data.contractNumber}</strong>
        </strong>
      </p>
    </div>

    <p className="mb-3">
      Dear <strong>{data.salutation}</strong> <strong>{data.contractorName}</strong>
    </p>


    <p className="mb-4">
      The purpose of this letter is to request your approval of a product
      descriptive modification to GSA Schedule Contract <strong>{data.contractNumber}</strong>{" "}
      under SIN <strong>{data.sin}</strong>. The modification consists of descriptive changes for{" "}
      <strong>{data.descriptionChanged}</strong> item(s) due to{" "}
      <strong>{data.modificationRationale}</strong>. These revisions will not result in any
      changes to the GSA price.
    </p>

    <p className="mb-4">
      I certify to the best of my knowledge that the information provided is
      current, complete, and accurate. All other terms and conditions of the
      contract remain unchanged.
    </p>
    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      <strong>{data.consultantName}</strong> at <strong>{data.consultantPhone}</strong> or <strong>{data.consultantEmail}</strong>.
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
