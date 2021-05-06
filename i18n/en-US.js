import materialRules from '@/i18n/en-US/material_rules'
import productRules from '@/i18n/en-US/product_rules'
import orderRules from '@/i18n/en-US/order_rules'

export default {
  name: 'Name',
  only: 'Only',
  except: 'Except',
  login: 'Login',
  logout: 'Log out',
  welcome: 'Welcome',
  consumables: 'Consumables',
  technicalList: {
    title: 'Technical List',
    new: 'New Rule',
    form: 'Rule Form',
    submit: 'Submit',
    forAll: 'Applies for all options',
    notAppliable: 'Not appliable for any options',
    only: 'Only appliable for:',
    except: 'Appliable for all except:',
    id: 'Rule Number',
    createdAt: 'Created At',
    actions: 'Actions',
    materialRules,
    productRules,
    orderRules
  }
}
