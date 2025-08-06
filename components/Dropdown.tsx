import RoundButton from '@/components/RoundButton'
import { Root, Trigger, Content, Item, ItemIcon } from 'zeego/dropdown-menu'

const Dropdown = () => {
  return (
    <Root>
      <Trigger>
        <RoundButton title="More" icon="ellipsis-horizontal" />
      </Trigger>

      <Content>
        <Item key="statement" textValue="Statement">
          <ItemIcon
            ios={{
              name: 'list.bullet.rectangle.fill',
              pointSize: 24,
            }}
          />
        </Item>

        <Item key="converter" textValue="Converter">
          <ItemIcon
            ios={{
              name: 'coloncurrencysign.arrow.circlepath',
              pointSize: 24,
            }}
          />
        </Item>

        <Item key="background" textValue="Background">
          <ItemIcon
            ios={{
              name: 'photo.fill',
              pointSize: 24,
            }}
          />
        </Item>
        <Item key="account" textValue="Add new account">
          <ItemIcon
            ios={{
              name: 'plus.rectangle.on.folder.fill',
              pointSize: 24,
            }}
          />
        </Item>
      </Content>
    </Root>
  )
}
export default Dropdown
