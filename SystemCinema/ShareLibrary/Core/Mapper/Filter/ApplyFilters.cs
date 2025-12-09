using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.Core.Mapper.Filter
{
    public static class Filter
    {
        public static IQueryable<T> ApplyFilters<T>(IQueryable<T> query, List<FilterClause> clauses)
        {
            var parameter = Expression.Parameter(typeof(T), "e");
            Expression combinedExpression = null;

            foreach (var clause in clauses)
            {
                var property = Expression.Property(parameter, clause.FieldName);

                object typedValue = Convert.ChangeType(clause.Value, property.Type);
                var constant = Expression.Constant(typedValue);

                Expression currentExpression = clause.Operator switch
                {
                    "eq" => Expression.Equal(property, constant),
                    "gt" => Expression.GreaterThan(property, constant),
                    "lt" => Expression.LessThan(property, constant),
                    "like" => Expression.Call(property, "Contains", null, constant),
                    _ => throw new ArgumentException($"The Operator is not found: {clause.Operator}"),
                };

                if (combinedExpression == null)
                {
                    combinedExpression = currentExpression;
                }
                else
                {
                    combinedExpression = Expression.AndAlso(combinedExpression, currentExpression);
                }

            }
            if (combinedExpression != null)
            {
                var lamda = Expression.Lambda<Func<T, bool>>(combinedExpression, parameter);
                query = query.Where(lamda);
            }
            return query;
        }
    }
}
