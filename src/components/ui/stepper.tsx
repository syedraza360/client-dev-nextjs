import { cn } from "@/helpers/utils"
import type { FC } from "react"
import { Fragment } from "react"
import { FiCheck } from "react-icons/fi"

interface IStepper {
  steps: Array<{ label: string }>
  active: number
  className?: string
}

const Stepper: FC<IStepper> = ({ steps, active, className }) => {
  return (
    <div className={cn("mb-8 flex items-center", className)}>
      {steps.map((step, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <hr
              className={cn(
                "flex-grow border-dashed",
                active > index && "border-main"
              )}
            />
          )}
          <div className="relative">
            {active > index + 1 ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-main">
                <FiCheck size={14} className="text-neutral-10" />
              </div>
            ) : (
              <p
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-70 text-11",
                  active === index + 1 && "border border-main"
                )}
              >
                {index + 1}
              </p>
            )}

            <p className="absolute left-1/2 mt-2 -translate-x-1/2 transform text-11 font-medium">
              {step?.label}
            </p>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export default Stepper
