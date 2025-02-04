import { DisplayMode } from '@microsoft/sp-core-library'
import { WebPartContext } from '@microsoft/sp-webpart-base'

export interface IAccordeonProps {
	description: string
	isDarkTheme: boolean
	environmentMessage: string
	hasTeamsContext: boolean
	userDisplayName: string
	context: WebPartContext
	listGuid: string
	title: string
	displayMode: DisplayMode
	items: any
	updateProperty: (value: string) => void
}
