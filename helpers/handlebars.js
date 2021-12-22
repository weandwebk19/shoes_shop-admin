function hbsHelpers(hbs) {
    return hbs.create({
    extname: '.hbs',
      helpers: {
        sum: function(a, b) {
          return a + b;
        },
        sub: function(a, b) {
            return a - b;
          }, 
        mul: function(a, b) { return (a * b).toFixed(2); },

        paginate: function(totalPages, totalItems, currentPage, options) {
            let result = [];

            if (currentPage == 0 ||currentPage == 1 || currentPage == 2) {
                const displayPages = totalPages < 6? totalPages: 5; 
                for (let i = 0; i < displayPages; i++) {
                  if(i < totalPages)
                    result.push(i);
                } 
            }
            else { 
                const displayPages = totalPages < 6? totalPages: 5; 
                for (let i = -2; i < displayPages - 2; i++) {
                  if(currentPage + i < totalPages)
                    result.push(currentPage + i);
                } 
            }
            return options.fn(result);
        },

        calcLimit: function(totalPages, totalItems, currentPage) {
          let limit;
          const temp = totalItems/totalPages;
          if(temp < 11) {
            limit = 10 * (currentPage + 1);
          }
          else if(temp < 26) {
            limit = 25 * (currentPage + 1);
          } else if(temp < 51) {
            limit = 50 * (currentPage + 1);
          }
          else if(temp < 101) {
            limit = 100 * (currentPage + 1);
          }
          return limit > totalItems? totalItems: limit;
        },

        calcOffset: function(totalPages, totalItems, currentPage) {
          let limit;
          const temp = totalItems/totalPages;
          if(temp < 11) {
            limit = 10;
          }
          else if(temp < 26) {
            limit = 25;
          } else if(temp < 51) {
            limit = 50;
          }
          else if(temp < 101) {
            limit = 100;
          }
          
          return limit * currentPage + 1;
        },

        sortable: (field, sort) => {
          const sortType = field === sort.column ? sort.type : 'default';
  
          const icons = {
            default: 'fa fa-sort',
            desc: 'fa fa-sort-amount-desc',
            asc: 'fa fa-sort-amount-asc'
          }
  
          const types = {
            default: 'desc',
            desc: 'asc',
            asc: 'desc',
          }
  
          const icon = icons[sortType];
          const type = types[sortType];
          return `<a href="" class="sort-btn text-dark ml-1" data-field=${field} data-type=${type}>
          <i class="${icon}"></i>
          </a>`
        },

      }
  
    });
  }
  
  module.exports = hbsHelpers;