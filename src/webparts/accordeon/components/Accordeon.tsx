import * as React from 'react'
import type { IAccordeonProps } from './IAccordeonProps'
// import { SPFI } from '@pnp/sp'
import { useEffect, useState } from 'react'
import { IAccordeon } from '../../../interfaces'
// import { getSP } from '../../../pnpjsConfig'
import '@pnp/sp/webs'
import '@pnp/sp/items'
import { Accordion } from '@pnp/spfx-controls-react'
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder'
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle'
import styles from './Accordeon.module.scss'
import { DefaultButton } from '@fluentui/react'

const Accordeon: React.FC<IAccordeonProps> = (
	props: IAccordeonProps
): JSX.Element => {

	const [accordeonItems, setAccordeonItems] = useState<IAccordeon[]>([])

	useEffect(() => {
		if (props.items) {
			console.log("XXXX : ", props.items);
			setAccordeonItems(props.items)
		}
	}, [props])

	return (
		<>
			<WebPartTitle
				displayMode={props.displayMode}
				title={props.title}
				updateProperty={props.updateProperty}
			/>
			{props.items ? (
				accordeonItems.map((o: IAccordeon, index: number) => {
					return (
						<Accordion
							key={index}
							title={o.Title}
							className={styles.accordeonStyle}
							defaultCollapsed={true}>
							{o.Body}
						</Accordion>
					)
				})
			) : (
				<Placeholder
					iconName='Edit'
					contentClassName={styles.contentStyles}
					iconText='Configure your web part'
					description='Please configure the web part.'
					buttonLabel='Configure'
					onConfigure={() => props.context.propertyPane.open()}
				/>
			)}
			<DefaultButton 
			styles={{
				root: {

				},
				description: {

				},
				iconHovered: {
					backgroundColor: "red"
				}
			}}
			/>
		</>
	)
}

export default Accordeon
