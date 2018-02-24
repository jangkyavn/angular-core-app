import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product/product-add/product-add.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { BillComponent } from './bill/bill.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Products'
        },
        children: [
            {
                path: 'product',
                component: ProductComponent,
                data: {
                    title: 'Product'
                }
            },
            {
                path: 'product-add',
                component: ProductAddComponent,
                data: {
                    title: 'Add Product'
                }
            },
            {
                path: 'product-edit/:id',
                component: ProductEditComponent,
                data: {
                    title: 'Edit Product'
                }
            },
            {
                path: 'product-category',
                component: ProductCategoryComponent,
                data: {
                    title: 'Product Category'
                }
            },
            {
                path: 'bill',
                component: BillComponent,
                data: {
                    title: 'Bill'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule { }
