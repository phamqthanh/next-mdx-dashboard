type PaginationsResponse = {
  paginations: (
    | {
        page: number;
        index: number;
        active: boolean;
      }
    | {
        page: string;
        type: string;
        index: number;
        active: boolean;
      }
  )[];
  canNextPage: boolean;
  canPrevPage: boolean;
};

function calculatePaginations(
  pageIndex: number,
  adjacent: number,
  totalPage: number
): PaginationsResponse;
function calculatePaginations(
  pageIndex: number,
  adjacent: number,
  totalRecords: number,
  pageSize: number
): PaginationsResponse;
function calculatePaginations(
  pageIndex: number,
  adjacent: number,
  totalPageOrRecords: number,
  pageSize?: number
) {
  const totalPage = pageSize ? Math.ceil(totalPageOrRecords / pageSize) : totalPageOrRecords;
  const lastPageMinusOne = totalPage - 1;

  // First page
  const firstPage = [
    { page: 1, index: 0, active: false },
    { page: 2, index: 1, active: false },
  ];
  const lastPage = [
    { page: lastPageMinusOne, index: lastPageMinusOne - 1, active: false },
    { page: totalPage, index: lastPageMinusOne, active: false },
  ];

  const paginations = [];
  // Paginations
  // paginations.push({ page: 1, actived: pageIndex === 0 });

  if (totalPage < 1 + (adjacent + 3) * 2) {
    for (let i = 1; i <= totalPage; i++) {
      paginations.push({
        page: i,
        index: i - 1,
        active: pageIndex === i - 1,
      });
    }
  } else if (totalPage > 1 + (adjacent + 2) * 2) {
    // in first, show early pages, and hide some from end
    if (pageIndex < (adjacent + 1) * 2) {
      for (let i = 1; i < (adjacent + 2) * 2; i++) {
        paginations.push({
          page: i,
          index: i - 1,
          active: pageIndex === i - 1,
        });
      }
      paginations.push(getEllipse());
      paginations.push(...lastPage);
      // paginations.push({ page: totalPage, active: false });
    } else if (totalPage - (adjacent + 1) * 2 > pageIndex && pageIndex > adjacent * 2) {
      //in middle; hide some front and some back
      paginations.push(...firstPage);
      paginations.push(getEllipse());
      for (let i = pageIndex + 1 - adjacent; i <= pageIndex + adjacent + 1; i++) {
        paginations.push({
          page: i,
          index: i - 1,
          active: pageIndex === i - 1,
        });
      }
      paginations.push(getEllipse());
      paginations.push(...lastPage);
    } else {
      //close to end; only hide early pages
      paginations.push(...firstPage, getEllipse());
      for (let i = totalPage - (adjacent + 1) * 2; i <= totalPage; i++) {
        paginations.push({
          page: i,
          index: i - 1,
          active: pageIndex === i - 1,
        });
      }
    }
  }
  // paginations.push({ page: totalPage, active: pageIndex + 1 === totalPage });

  return {
    paginations,
    canNextPage: pageIndex + 1 < totalPage,
    canPrevPage: pageIndex > 0,
  };
}
function getEllipse() {
  return { page: "...", type: "elipse", index: -Math.ceil(Math.random() * 100), active: false };
}

export { calculatePaginations };
