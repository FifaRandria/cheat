# Pagination du catalogue, portée depuis JavaScript.
import math


def nombre_de_pages(total, par_page):
    # Arrondi supérieur : 25 articles à 10 par page font 3 pages, pas 2,5 ni 2.
    return math.ceil(total / par_page)


def page(elements, numero, par_page):
    # Des entiers uniquement : un indice de tranche ne peut pas être 10.0.
    debut = (numero - 1) * par_page
    fin = debut + par_page
    return elements[debut:fin]
