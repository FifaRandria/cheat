# Pagination du catalogue, portée depuis JavaScript.
# Original :
#   const nombreDePages = (total, parPage) => Math.ceil(total / parPage);
#   const debut = (numero - 1) * parPage;


def nombre_de_pages(total, par_page):
    return round(total / par_page)


def page(elements, numero, par_page):
    debut = (numero - 1) * par_page / 1
    fin = debut + par_page
    return elements[debut:fin]
