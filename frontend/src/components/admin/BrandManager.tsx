import CatalogNameManager
    from './CatalogNameManager'

import {
    createBrand,
    deleteBrand,
    getBrands,
    updateBrand,
} from '../../api/catalogApi'

export default function BrandManager() {

    return (
        <CatalogNameManager
            title="Brands"
            singular="Brand"
            queryKey={[
                'admin-brands',
            ]}
            loadItems={
                getBrands
            }
            createItem={
                createBrand
            }
            updateItem={
                updateBrand
            }
            deleteItem={
                deleteBrand
            }
        />
    )
}