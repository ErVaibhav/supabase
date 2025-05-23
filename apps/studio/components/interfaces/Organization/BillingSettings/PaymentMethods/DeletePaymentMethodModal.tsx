import { useParams } from 'common'
import { toast } from 'sonner'
import { Button, Modal } from 'ui'

import { useOrganizationPaymentMethodDeleteMutation } from 'data/organizations/organization-payment-method-delete-mutation'
import type { OrganizationPaymentMethod } from 'data/organizations/organization-payment-methods-query'
import { Admonition } from 'ui-patterns'

export interface DeletePaymentMethodModalProps {
  selectedPaymentMethod?: OrganizationPaymentMethod
  onClose: () => void
}

const DeletePaymentMethodModal = ({
  selectedPaymentMethod,
  onClose,
}: DeletePaymentMethodModalProps) => {
  const { slug } = useParams()

  const { mutate: deletePayment, isLoading: isDeleting } =
    useOrganizationPaymentMethodDeleteMutation({
      onSuccess: () => {
        toast.success(
          `Successfully removed payment method ending with ${selectedPaymentMethod?.card?.last4}`
        )
        onClose()
      },
    })

  const onConfirmDelete = async () => {
    if (!slug) return console.error('Slug is required')
    if (!selectedPaymentMethod) return console.error('Card ID is required')
    deletePayment({ slug, cardId: selectedPaymentMethod.id })
  }

  return (
    <Modal
      visible={selectedPaymentMethod !== undefined}
      size="medium"
      header={`Confirm to delete payment method ending with ${selectedPaymentMethod?.card?.last4}`}
      onCancel={() => onClose()}
      customFooter={
        <div className="flex items-center gap-2">
          <Button type="default" disabled={isDeleting} onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            type="primary"
            disabled={isDeleting}
            loading={isDeleting}
            onClick={onConfirmDelete}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <Modal.Content>
        <Admonition
          type="default"
          title="This will permanently delete your payment method."
          description="You can re-add the payment method any time."
        />
      </Modal.Content>
    </Modal>
  )
}

export default DeletePaymentMethodModal
