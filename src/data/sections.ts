import MyLocationIcon from '@material-ui/icons/MyLocation'
import ImportContactsIcon from '@material-ui/icons/ImportContacts'
import SurroundSoundIcon from '@material-ui/icons/SurroundSound'
import AllInboxIcon from '@material-ui/icons/AllInbox'
import SettingsIcon from '@material-ui/icons/Settings'
import SectionMap from 'src/components/SectionMap'
import SectionAbility from 'src/components/SectionAbility'
import SectionInventory from 'src/components/SectionInventory'
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
    key: 'ability',
    name: 'Ability',
    Component: SectionAbility,
    Icon: SurroundSoundIcon,
  },
  {
    key: 'inventory',
    name: 'Inventory',
    Component: SectionInventory,
    Icon: AllInboxIcon,
  },
  {
    key: 'settings',
    name: 'Settings',
    Component: SectionSettings,
    Icon: SettingsIcon,
  },
]
