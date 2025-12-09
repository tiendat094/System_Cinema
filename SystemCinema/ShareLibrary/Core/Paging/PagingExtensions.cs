using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.Core.Paging
{
    public static class PagingExtensions
    {
        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query , PagedResultRequestDto input) where T : class
        {
            var skipCount = (input.Page - 1) * input.PageSize;

            return query.Skip(skipCount).Take(input.PageSize);
        }
    }
}
