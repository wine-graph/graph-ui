import PageHeader from "./common/PageHeader.tsx";
import SectionCard from "./common/SectionCard.tsx";
import {FaConnectdevelop} from "../assets/icons.ts";

export const ProducerMarketplace = () => <div>
  <PageHeader title="Producer Marketplace" desc="Source new wines from 'our' producers"/>
  <SectionCard className="mt-5 mx-auto" cardHeader={{icon: FaConnectdevelop, title: "Connect with Producers"}}>
    <>
    </>
  </SectionCard>
</div>