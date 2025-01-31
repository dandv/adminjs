/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */

import React, { ReactElement } from 'react'
import { ActionResponse } from '../../../../backend/actions/action.interface'

import { ActionJSON, buildActionTestId } from '../../../interfaces'
import { useAction } from '../../../hooks'
import allowOverride from '../../../hoc/allow-override'

/**
 * @alias ActionButtonProps
 * @memberof ActionButton
 */
export type ActionButtonProps = {
  /** Action to which button should redirect */
  action: ActionJSON;
  /** Id of a resource of an action */
  resourceId: string;
  /** Optional recordId for _record_ action */
  recordId?: string;
  /** Optional recordIds for _bulk_ action */
  recordIds?: Array<string>;
  /** optional callback function which will be triggered when action is performed */
  actionPerformed?: (action: ActionResponse) => any;
  children?: React.ReactNode;
}

/**
 * Renders Button which redirects to given action
 *
 * ### Usage
 *
 * ```
 * import { ActionButton } from 'adminjs'
 * ```
 *
 * @component
 * @subcategory Application
 */
const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { children, action, actionPerformed, resourceId, recordId, recordIds } = props

  const { href, handleClick } = useAction(action, {
    resourceId, recordId, recordIds,
  }, actionPerformed)

  if (!action) {
    return null
  }

  const firstChild = React.Children.toArray(children)[0]

  if (!firstChild
    || typeof firstChild === 'string'
    || typeof firstChild === 'number'
    || typeof firstChild === 'boolean') {
    throw new Error('ActionButton has to have one child')
  }

  const WrappedElement = React.cloneElement(firstChild as ReactElement<any>, {
    onClick: handleClick,
    'data-testid': buildActionTestId(action),
    href,
  })

  return WrappedElement
}

const OverridableActionButton = allowOverride(ActionButton, 'ActionButton')

export {
  OverridableActionButton as default,
  OverridableActionButton as ActionButton,
}
