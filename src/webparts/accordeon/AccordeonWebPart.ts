import { IReadonlyTheme } from '@microsoft/sp-component-base'
import { Version } from '@microsoft/sp-core-library'
import {
	PropertyPaneTextField,
	type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane'
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'
import * as React from 'react'
import * as ReactDom from 'react-dom'

import '@pnp/sp/lists'
import '@pnp/sp/webs'
import {
	PropertyFieldListPicker,
	PropertyFieldListPickerOrderBy,
} from '@pnp/spfx-property-controls'
import * as strings from 'AccordeonWebPartStrings'
import spservices from '../spServices/spservices'
import Accordeon from './components/Accordeon'
import { IAccordeonProps } from './components/IAccordeonProps'

export interface IAccordeonWebPartProps {
	description: string
	list: string
	title: string
}

export default class AccordeonWebPart extends BaseClientSideWebPart<IAccordeonWebPartProps> {
	private _isDarkTheme: boolean = false
	private _environmentMessage: string = ''
	private spService: spservices

	public async render(): Promise<void> {
		let result: any
		console.log(this.properties)
		console.log('Context : ', this.context.pageContext.site.absoluteUrl)

		if (this.properties.list) {
			result = await this.spService.getAccordeonItems(
				'https://aonicdemotenant.sharepoint.com/sites/Sandbox',
				this.properties.list
			)
			console.log('Result : ', result)
		}

		const element: React.ReactElement<IAccordeonProps> = React.createElement(
			Accordeon,
			{
				description: this.properties.description,
				isDarkTheme: this._isDarkTheme,
				environmentMessage: this._environmentMessage,
				hasTeamsContext: !!this.context.sdks.microsoftTeams,
				userDisplayName: this.context.pageContext.user.displayName,
				context: this.context,
				listGuid: this.properties.list,
				items: result ? result : undefined,
				title: this.properties.title,
				displayMode: this.displayMode,
				updateProperty: (value: string) => {
					if (value) {
						this.properties.title = value
						this.render()
					}
				},
			}
		)

		ReactDom.render(element, this.domElement)
	}

	protected onInit(): Promise<void> {
		this.spService = new spservices(this.context)

		return this._getEnvironmentMessage().then((message) => {
			this._environmentMessage = message
		})
	}

	private _getEnvironmentMessage(): Promise<string> {
		if (!!this.context.sdks.microsoftTeams) {
			return this.context.sdks.microsoftTeams.teamsJs.app
				.getContext()
				.then((context) => {
					let environmentMessage: string = ''
					switch (context.app.host.name) {
						case 'Office':
							environmentMessage = this.context.isServedFromLocalhost
								? strings.AppLocalEnvironmentOffice
								: strings.AppOfficeEnvironment
							break
						case 'Outlook':
							environmentMessage = this.context.isServedFromLocalhost
								? strings.AppLocalEnvironmentOutlook
								: strings.AppOutlookEnvironment
							break
						case 'Teams':
						case 'TeamsModern':
							environmentMessage = this.context.isServedFromLocalhost
								? strings.AppLocalEnvironmentTeams
								: strings.AppTeamsTabEnvironment
							break
						default:
							environmentMessage = strings.UnknownEnvironment
					}

					return environmentMessage
				})
		}

		return Promise.resolve(
			this.context.isServedFromLocalhost
				? strings.AppLocalEnvironmentSharePoint
				: strings.AppSharePointEnvironment
		)
	}

	protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
		if (!currentTheme) {
			return
		}

		this._isDarkTheme = !!currentTheme.isInverted
		const { semanticColors } = currentTheme

		if (semanticColors) {
			this.domElement.style.setProperty(
				'--bodyText',
				semanticColors.bodyText || null
			)
			this.domElement.style.setProperty('--link', semanticColors.link || null)
			this.domElement.style.setProperty(
				'--linkHovered',
				semanticColors.linkHovered || null
			)
		}
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement)
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0')
	}

	protected onPropertyPaneFieldChanged(
		propertyPath: string,
		oldValue: any,
		newValue: any
	): void {
		console.log(propertyPath, newValue)
		if (propertyPath === 'description') {
			this.properties.description = newValue 
			this.properties.title = newValue 
			this.render()
		}
	}
	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription,
					},
					groups: [
						{
							groupName: strings.BasicGroupName,
							groupFields: [
								PropertyPaneTextField('description', {
									label: strings.DescriptionFieldLabel,
								}),
								PropertyFieldListPicker('list', {
									label: 'Select a list',
									selectedList: this.properties.list,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									webAbsoluteUrl:
										'https://aonicdemotenant.sharepoint.com/sites/sandbox',
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any,
									deferredValidationTime: 0,
									key: 'listPickedFieldId',
								}),
							],
						},
					],
				},
			],
		}
	}
}
