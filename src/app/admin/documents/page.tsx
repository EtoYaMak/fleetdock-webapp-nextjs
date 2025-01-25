//map through all the truckers and broker businesses and display the documents
//
"use client";
import Certifications from "./trucker/certifications/page";
import Licenses from "./trucker/licenses/page";

export default function DocumentsPage() {
    return (
        <div>
            <Certifications />
            <Licenses />
        </div>
    );
}
