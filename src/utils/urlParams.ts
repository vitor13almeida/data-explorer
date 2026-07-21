export function prepareUrlSearchParams(
  page: number = 0,
  page_size: number = 20,
  sortCol: string | null = null,
  sortOrder: string | null = null,
  filters: Record<string, any> | null = null,
): URLSearchParams {
  let params = {
    page: page.toString(),
    page_size: page_size.toString(),
  };

  if (sortCol) {
    params = { ...params, [`${sortCol}__sort`]: sortOrder };
  }

  if (filters && Object.keys(filters).length > 0) {
    Object.keys(filters).forEach((filter) => {
      if (filters[filter] && String(filters[filter]).length > 0) {
        params = { ...params, [`${filter}__contains`]: filters[filter] };
      }
    });
  }

  const queryParams = new URLSearchParams(params);

  return queryParams;
}
