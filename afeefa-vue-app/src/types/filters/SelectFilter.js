import { BaseFilter } from './BaseFilter'

export class SelectFilter extends BaseFilter {
  options = []

  initFromUsed (usedFilters, filterOptions) {
    super.initFromUsed(usedFilters)

    if (filterOptions[this.name]) {
      this.options = [
        {
          text: 'Alle',
          value: null
        },

        ...filterOptions[this.name].map(option => {
          return {
            text: option.title,
            value: option.id
          }
        })
      ]
    }
  }
}
