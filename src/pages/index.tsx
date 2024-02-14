import React, { useState, useEffect } from "react";
import { STATIONS } from "../constants/Stations";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import flexsearch from "flexsearch";



// Create a flexsearch index, and add items to it.
const index = new flexsearch.Index({
  charset: "utf-8",
  preset: "match",
  tokenize: "full",
  cache: false,
});

STATIONS.map((station) => {
  index.add(
    station.id,
    station.district + " " + station.name + " " + station.address,
  );
});

type TableItem = {
  id: string;
  district: string;
  name: string;
  address: string;
  amount: string;
};

const StationsTable: React.FC = () => {
  const router = useRouter();

  const { pageSize } = router.query;
  const itemsPerPage = pageSize ? Number(pageSize) : 5;

  const [resultStationIds, setresultStationIds] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortOrder, setSortOrder] = useState("ascd");
  const [stations, setStations] = useState(STATIONS);

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleData = stations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(stations.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (hasSearched) {
      const searchResult = STATIONS.filter((station) =>
        resultStationIds.includes(station.id),
      );
      setStations(searchResult);
    } else {
      setStations(STATIONS);
    }
  }, [hasSearched]);

  const handleSort = (key: string) => {
    const sortedData = [...stations];
    if (key === "name" || key === "district" || key === "address") {
      const collator = new Intl.Collator("zh-TW", {
        sensitivity: "base",
        ignorePunctuation: true,
      });
      sortedData.sort((a: any, b: any) => {
        if (sortOrder === "ascd") {
          return collator.compare(a[key], b[key]);
        } else {
          return collator.compare(b[key], a[key]);
        }
      });
    } else {
      sortedData.sort((a: any, b: any) => {
        if (sortOrder === "ascd") {
          return a[key] - b[key];
        } else {
          return b[key] - a[key];
        }
      });
    }
    setStations(sortedData);
    setSortOrder(sortOrder === "ascd" ? "dscd" : "ascd");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Charging Stations
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the charging stations in Taipei.
          </p>
        </div>
      </div>
      {/* Search input */}
      <div className="flex max-w-lg rounded-md shadow-sm">
        <input
          type="text"
          placeholder={"search"}
          className="focus:ring-primarybg my-2 block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 px-1.5 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const ids = index.search(e.currentTarget.value) as string[];
              setHasSearched(true);
              setresultStationIds(ids);
              if (!e.currentTarget.value) setHasSearched(false);
            }
          }}
        />
      </div>
      {/* Pagination buttons */}
      <div className="my-2 flex">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="mx-2"
        >
          Previous
        </button>

        <span className="mx-auto">
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="mx-2"
        >
          Next
        </button>
      </div>
      {/* Charging Stations Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="table-compact table w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    <button className="flex" onClick={() => handleSort("id")}>
                      Id
                      <Bars3BottomLeftIcon
                        className="group-hover:text-primarybg mx-2 h-6 w-6 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button
                      className="flex"
                      onClick={() => handleSort("district")}
                    >
                      district
                      <Bars3BottomLeftIcon
                        className="group-hover:text-primarybg mx-2 h-6 w-6 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button className="flex" onClick={() => handleSort("name")}>
                      name
                      <Bars3BottomLeftIcon
                        className="group-hover:text-primarybg mx-2 h-6 w-6 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button
                      className="flex"
                      onClick={() => handleSort("address")}
                    >
                      address
                      <Bars3BottomLeftIcon
                        className="group-hover:text-primarybg mx-2 h-6 w-6 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button
                      className="flex"
                      onClick={() => handleSort("amount")}
                    >
                      amount
                      <Bars3BottomLeftIcon
                        className="group-hover:text-primarybg mx-2 h-6 w-6 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleData.map((station: TableItem) => (
                  <TableItem
                    key={station.id}
                    id={station.id}
                    district={station.district}
                    name={station.name}
                    address={station.address}
                    amount={station.amount}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableItem = ({ id, district, name, address, amount }: TableItem) => {
  return (
    <tr key={id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {id}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {district}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {address}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {amount}
      </td>
    </tr>
  );
};

export default StationsTable;
