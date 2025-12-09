using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.Core.Mapper.Filter
{
    public class FilterClause
    {
        public string FieldName { get; set; }
        public string Operator { get; set; }

        public string Value { get; set; }
    }
}
