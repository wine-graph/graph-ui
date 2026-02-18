import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {RETAILER_QUERY} from "../../../services/retailer/retailerGraph.ts";
import {retailerClient} from "../../../services/apolloClient.ts";
import type {Retailer, RetailerInventory} from "../retailer.ts";
import {useMemo} from "react";
import RetailerInventorySkeleton from "./RetailerInventorySkeleton.tsx";
import {RetailerInventorySection} from "./RetailerInventorySection.tsx";
import RetailerLocationCard from "../components/RetailerLocationCard.tsx";


export const RetailerInventoryPage = () => {

  const {retailerId} = useParams();

  const {data, loading} = useQuery(RETAILER_QUERY, {
    variables: {id: retailerId},
    client: retailerClient,
    skip: !retailerId,
  });

  const retailer = data?.Retailer?.retailer as Retailer | undefined;

  const inventory = useMemo(() => {
    const inv = retailer?.inventory as RetailerInventory[] | undefined;
    return Array.isArray(inv) ? inv : [];
  }, [retailer]);

  // Unified loading state: wait for both auth and retailer query to settle
  if (loading) return <RetailerInventorySkeleton/>; // Filtered rows based on search query (name/varietal/vintage)

  return (retailerId && retailer && inventory) && (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <RetailerLocationCard retailer={retailer}/>

      <RetailerInventorySection inventory={inventory}/>

    </div>
  )

}
