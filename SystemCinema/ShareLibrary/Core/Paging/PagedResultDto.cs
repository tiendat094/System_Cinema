using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.Core.Paging
{
    public class PagedResultDto<T>
    {
        public long TotalItems { get; set; }
        public IReadOnlyList<T> Items { get; set; } 
        public int Page {  get; set; }
        public int PageSize {  get; set; }
        public int TotalPages { get; set; }
        public PagedResultDto(long totalCount, IReadOnlyList<T> items, int page, int pageSize, int totalPages)
        {
            TotalItems = totalCount;
            Items = items;
            Page = page;
            PageSize = pageSize;
            TotalPages = totalPages;
        }

        public PagedResultDto() { }
    }
}
