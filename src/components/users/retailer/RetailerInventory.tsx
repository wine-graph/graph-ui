import { useCallback, useEffect, useState } from "react";
import { FaSearch, FaSyncAlt, IoClose } from "../../../assets/icons";
import { type RetailerInventory } from "../../../types/Retailer";
import Button from "../../common/Button.tsx";
import PageHeader from "../../common/PageHeader";

type RetailerCellarProps = {
  items: RetailerInventory[];
};

export const RetailerCellar = ({ items }: RetailerCellarProps) => {
  const [inventory, setInventory] = useState<RetailerInventory[]>(items);
  const [searchInput, setSearchInput] = useState("");
  const [showSquareInventory, setShowSquareInventory] =
    useState<boolean>(false);

  useEffect(() => {
    setInventory(items);
  }, [items]);

  const handleSearch = useCallback(() => {
    if (searchInput.trim() === "") {
      setInventory(items);
    } else {
      const searchItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setInventory(searchItems);
    }
  }, [searchInput, inventory, items]);

  // -------------------------- Square Inventory ------------------------------

  const squareFetchData = items.slice(0, 5);

  const [selected, setSelected] = useState<string[]>([]);

  const allChecked = selected.length === squareFetchData.length;

  const toggleAll = () => {
    if (allChecked) {
      setSelected([]); // uncheck all
    } else {
      setSelected(squareFetchData.map((wine) => wine.wineId)); // check all
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handelSaveToInventory = () => {
    // TODO: need to add functionality
    console.log(selected);
    setShowSquareInventory(false);
  };

  return (
    <>
      <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
        <PageHeader
          title="Retailer Cellar"
          desc="Current Inventory shown below. Fetch from Square to review and add new
        wines."
        />
        <div className="mt-8">
          <div className="flex items-center justify-between my-5">
            <div className="search border border-[#c4a1a8] flex items-center rounded-md bg-background w-1/3 font-roboto">
              <button
                onClick={handleSearch}
                className="border-r px-2 border-gray-300"
              >
                <FaSearch className="text-gray-700 cursor-pointer" />
              </button>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (e.target.value === "") {
                    setInventory(items); // reset
                  }
                }}
                placeholder="search wine, varietal, producer"
                className="px-2 py-2 outline-none text-sm text-textPrimary-1 focus:bg-white rounded-r-md w-full"
              />
            </div>

            <button
              onClick={() => setShowSquareInventory(true)}
              className="flex items-center gap-1 sm:gap-3 bg-primary hover:bg-buttonHover text-white font-medium text-sm px-3 sm:px-5 py-2 rounded-md cursor-pointer"
            >
              <FaSyncAlt className="hidden sm:inline-flex" />
              <span>Fetch from Square</span>
            </button>
          </div>
          <div className="items mt-8 w-full">
            <div className="overflow-x-auto rounded-md shadow">
              <table className="table-auto w-full border-collapse">
                {/* Table Head */}
                <thead>
                  <tr className="bg-background text-left text-sm font-medium text-gray-600">
                    <th className="px-6 py-4">Wine</th>
                    <th className="px-6 py-4">Vintage</th>
                    <th className="px-6 py-4">Varietal</th>
                    <th className="px-6 py-4">Producer</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Source</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-sm text-textSecondary divide-y divide-gray-200">
                  {inventory.length === 0 ? (
                    <p className="p-6">No data found!</p>
                  ) : (
                    inventory.map((item) => (
                      <tr key={item.wineId} className="hover:bg-tableHover/40">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4">{item.vintage}</td>
                        <td className="px-6 py-4">{item.varietal}</td>
                        <td className="px-6 py-4">{item.producer}</td>
                        <td className="px-6 py-4">{item.price}</td>
                        <td className="px-6 py-4 font-semibold text-textPrimary-1">
                          <span className="bg-[#ffede1] px-2 py-1 rounded">
                            {item.source}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Square Invetory */}
      {showSquareInventory && (
        <div className="squareInventory z-50 fixed top-0 left-0 right-0 bg-black/40 w-full h-screen flex-center backdrop-blur-xs">
          <div className="relative items mt-8 w-4/5 mx-auto bg-white rounded-md">
            <button
              onClick={() => setShowSquareInventory(false)}
              className="absolute -top-15 -right-12 p-2.5 rounded-full bg-gray-50 cursor-pointer"
            >
              <IoClose size={22} className="text-textPrimary-1" />
            </button>
            <div className="w-full max-h-[30rem] overflow-x-auto rounded-md shadow">
              <table className="table-auto w-full border-collapse">
                {/* Table Head */}
                <thead className="sticky top-0">
                  <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                    <th className="px-6 py-4" title="Select All">
                      <input
                        type="checkbox"
                        className="h-5 w-5 cursor-pointer transition-all rounded-md shadow hover:shadow-md border border-slate-300 "
                        checked={allChecked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="px-6 py-4">Wine</th>
                    <th className="px-6 py-4">Vintage</th>
                    <th className="px-6 py-4">Varietal</th>
                    <th className="px-6 py-4">Producer</th>
                    <th className="px-6 py-4">Price</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-sm text-textSecondary divide-y divide-gray-200">
                  {squareFetchData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center">
                        No data found!
                      </td>
                    </tr>
                  ) : (
                    squareFetchData.map((item) => (
                      <tr key={item.wineId} className="hover:bg-tableHover/40">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="h-5 w-5 cursor-pointer transition-all rounded-md shadow hover:shadow-md border border-slate-300"
                            checked={selected.includes(item.wineId)}
                            onChange={() => toggleOne(item.wineId)}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4">{item.vintage}</td>
                        <td className="px-6 py-4">{item.varietal}</td>
                        <td className="px-6 py-4">{item.producer}</td>
                        <td className="px-6 py-4">{item.price}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="action p-6">
                <Button
                  disabled={selected.length === 0}
                  onClick={handelSaveToInventory}
                  className="bg-primary text-white font-medium px-3 disable:not-hover:bg-buttonHover disabled:opacity-70 disabled:cursor-not-allowed "
                >
                  <span className="text-sm">Save to Inventory</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
