export const paginate = (page: number, skip: number) => {
    const currentPage = page <= 0 ? 1 : page;
    return skip * (currentPage - 1);
};
