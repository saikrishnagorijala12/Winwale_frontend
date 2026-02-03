export const ProductDescriptiveChangeTemplate = ({ data }: { data: any }) => (
  <div className="relative text-[13px] leading-[1.6] text-foreground px-8 py-6">
    <div className="absolute top-6 right-8">
      <img
        src="winvale-logo.png"
        alt="Winvale"
        className="h-10 w-[140px] object-contain"
      />
    </div>

    <p className="mb-4">[{data.submissionDate}]</p>

    <div className="mb-4">
Attn: Jane M. Doe (CO-12345)      <p>General Services Administration</p>
      <p>{data.gsaOfficeAddressLine}</p>
      <p>{data.gsaOfficeCityStateZip}</p>
    </div>

    <div className="mb-4">
      <p>
        <strong>Re:</strong> {data.companyName}
        <br />
        <strong>
          Product Descriptive Change Modification to GSA Contract{" "}
          {data.contractNumber}
        </strong>
      </p>
    </div>

    <p className="mb-3">Dear Mr. John A. Smith</p>


    <p className="mb-4">
      The purpose of this letter is to request your approval of a product
      descriptive modification to GSA Schedule Contract {data.contractNumber}{" "}
      under SIN {data.sin}. The modification consists of descriptive changes for{" "}
      {data.numberOfItemsChanged || "[#]"} item(s) due to{" "}
      {data.modificationRationale}. These revisions will not result in any
      changes to the GSA price.
    </p>

    <p className="mb-4">
      I certify to the best of my knowledge that the information provided is
      current, complete, and accurate. All other terms and conditions of the
      contract remain unchanged.
    </p>
    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      {data.consultantName} at {data.consultantPhone} or {data.consultantEmail}.
    </p>

    <p className="mb-6">Respectfully,</p>

     <div>
      <p className="font-semibold">
        {data.authorizedNegotiatorName || "John R. Doe"}
      </p>
      <p>
        {data.authorizedNegotiatorTitle || "Director of Contracts"} – Authorized
        to sign on behalf of {data.companyName || "COMPANY NAME"}
      </p>
    </div>
  </div>
);
