package com.pmaj.pm_mobile.tools;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import com.pmaj.pm_mobile.model.Family;


import com.pmaj.pm_mobile.activities.HomeActivity;


/**
 * Created by Hugo on 20/10/2017.
 */

//TODO PROBLEM DE CONFIG AVEC ADAPTER
public class MyAdapter extends RecyclerView.Adapter<MyAdapter.ViewHolder> {

    private List<Family> dataset;
    private Context ActivityContext;

    // Provide a reference to the views for each data item
    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView family;
        public TextView code;

        public ViewHolder(View v) {
            super(v);
            family = v.findViewById(R.id.family);
            code = v.findViewById(R.id.code);
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    public MyAdapter(List<Family> dataset, Context ActivityContext) {

        this.dataset = dataset;
        this.ActivityContext = ActivityContext;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public MyAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.famille, parent, false);
        return new ViewHolder(v);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element
        holder.family.setText(dataset.get(position).getLogin());
        holder.code.setText(dataset.get(position).getMessage());

    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return dataset.size();
    }




}