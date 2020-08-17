using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assets.Scripts.Helper
{
           // When you implement IEnumerable, you must also implement IEnumerator.
    public class MapEnum<TKey, TValue> : IEnumerator
    {
        public KeyValuePair<TKey, TValue>[] list;

        // Enumerators are positioned before the first element
        // until the first MoveNext() call.
        int position = -1;

        public MapEnum(KeyValuePair<TKey, TValue>[] list)
        {
            this.list = list;
        }

        public bool MoveNext()
        {
            position++;
            return (position < list.Length);
        }

        public void Reset()
        {
            position = -1;
        }

        object IEnumerator.Current
        {
            get
            {
                return Current;
            }
        }

        public KeyValuePair<TKey, TValue> Current
        {
            get
            {
                try
                {
                    return list[position];
                }
                catch (IndexOutOfRangeException)
                {
                    throw new InvalidOperationException();
                }
            }
        }
    }
}
