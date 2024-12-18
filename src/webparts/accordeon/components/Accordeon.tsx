import * as React from 'react'
import type { IAccordeonProps } from './IAccordeonProps'
import { SPFI } from '@pnp/sp'
import { useEffect, useState } from 'react'
import { IAccordeon } from '../../../interfaces'
import { getSP } from '../../../pnpjsConfig'
import '@pnp/sp/webs'
import '@pnp/sp/items'
import { Accordion } from '@pnp/spfx-controls-react'
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder'
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle'

const Accordeon: React.FC<IAccordeonProps> = (
	props: IAccordeonProps
): JSX.Element => {
	const _sp: SPFI = getSP(props.context)

	const [accordeonItems, setAccordeonItems] = useState<IAccordeon[]>([])

	const getAccordeonItems = async (): Promise<void> => {
		try {
			const items = await _sp.web.lists
				.getById(props.listGuid)
				.items.select()
				.orderBy('Letter', true)
				.orderBy('Title', true)()
			console.log('Fetched items:', items)
			setAccordeonItems(items)
		} catch (error) {
			console.error('Error fetching items:', error)
		}
	}

	useEffect(() => {
		if (props.listGuid && props.listGuid !== '') {
			getAccordeonItems().catch((err) => console.error(err))
		}
	}, [props])

	return (
		<>
			<WebPartTitle
				displayMode={props.displayMode}
				title={props.title}
				updateProperty={props.updateProperty}
			/>
			{props.listGuid ? (
				accordeonItems.map((o: IAccordeon, index: number) => {
					return (
						<Accordion key={index} title={o.Title} defaultCollapsed={true}>
							{o.Body}
						</Accordion>
					)
				})
			) : (
				<Placeholder
					iconName='Edit'
					iconText='Configure your web part'
					description='Please configure the web part.'
					buttonLabel='Configure'
					onConfigure={() => props.context.propertyPane.open()}
				/>
			)}
		</>
	)
}

export default Accordeon
