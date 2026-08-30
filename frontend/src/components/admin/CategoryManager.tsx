import CatalogNameManager
    from './CatalogNameManager'

import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from '../../api/catalogApi'

export default function CategoryManager() {

    return (
        <CatalogNameManager
            title="Categories"
            singular="Category"
            queryKey={[
                'admin-categories',
            ]}
            loadItems={
                getCategories
            }
            createItem={
                createCategory
            }
            updateItem={
                updateCategory
            }
            deleteItem={
                deleteCategory
            }
        />
    )
}