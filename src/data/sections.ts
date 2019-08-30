import MyLocationIcon from '@material-ui/icons/MyLocation'
import ImportContactsIcon from '@material-ui/icons/ImportContacts'
import AllInboxIcon from '@material-ui/icons/AllInbox'
import SettingsIcon from '@material-ui/icons/Settings'
import SectionMap from 'src/components/SectionMap'
import SectionCharacter from 'src/components/SectionCharacter'
import SectionLocation from 'src/components/SectionLocation'
import { IconComponent } from 'src/common/interfaces'
import SectionSettings from 'src/components/SectionSettings'

export interface SectionItem {
  key: string
  name: string
  Component: any
  Icon: IconComponent
}

export const sections: SectionItem[] = [
  {
    key: 'location',
    name: 'Location',
    Component: SectionLocation,
    Icon: MyLocationIcon,
  },
  {
    key: 'map',
    name: 'Map',
    Component: SectionMap,
    Icon: ImportContactsIcon,
  },
  {
    key: 'character',
    name: 'Character',
    Component: SectionCharacter,
    Icon: AllInboxIcon,
  },
  {
    key: 'settings',
    name: 'Settings',
    Component: SectionSettings,
    Icon: SettingsIcon,
  },
]
