import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

const ProductSkeleton = () => {
  return (
    <>
      <div className="hidden dark:block">
        <SkeletonTheme baseColor="#344054" highlightColor="#445064">
          <div className={"overflow-hidden border border-gray-700"}>
            <div style={{ lineHeight: 1 }}>
              <div className="bg-gray-700">
                <Skeleton className="aspect-[3/4]" />
              </div>
              <div className="p-2">
                <Skeleton className="mb-2.5 text-sm" />
                <Skeleton className="ml-auto" width={50} />
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </div>
      <div className="dark:hidden">
        <SkeletonTheme baseColor="#EAECF0" highlightColor="#e5e5e5">
          <div className="overflow-hidden border border-gray-200">
            <div style={{ lineHeight: 1 }}>
              <div className="bg-gray-200">
                <Skeleton className="aspect-[3/4]" />
              </div>
              <div className="p-2">
                <Skeleton className="mb-2.5 text-sm" />
                <Skeleton className="ml-auto" width={50} />
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </div>
    </>
  )
}

export default ProductSkeleton
