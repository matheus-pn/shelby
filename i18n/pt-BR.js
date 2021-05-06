import materialRules from '@/i18n/pt-BR/material_rules'
import productRules from '@/i18n/pt-BR/product_rules'
import orderRules from '@/i18n/pt-BR/order_rules'

export default {
  name: 'Nome',
  only: 'Somente',
  except: 'Exceto',
  login: 'Entrar',
  logout: 'Sair',
  welcome: 'Inicio',
  consumables: 'Consumíveis',
  technicalList: {
    title: 'Lista técnica',
    new: 'Nova Regra',
    form: 'Formulário de Regra',
    submit: 'Submeter',
    forAll: 'Vale para a todas opções',
    notAppliable: 'Não vale para nenhuma opção',
    only: 'Vale somente para:',
    except: 'Vale para todos exceto:',
    id: 'Numero da regra',
    createdAt: 'Created At',
    actions: 'Actions',
    materialRules,
    productRules,
    orderRules
  }
}
